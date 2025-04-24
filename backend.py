import googleapiclient.discovery
import googleapiclient.errors
import pandas as pd
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from sklearn.feature_extraction.text import CountVectorizer
from flask import Flask, request, jsonify, send_file
from urllib.parse import urlparse, parse_qs
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table
from reportlab.lib.styles import getSampleStyleSheet
import io
import google.generativeai as genai
import re
from waitress import serve
from flask_cors import CORS
import os
from tqdm import tqdm
from dotenv import load_dotenv
from bs4 import BeautifulSoup

# Load environment variables from .env or .env.local file
load_dotenv(".env.local")

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-domain communication

VENV_PATH = os.getenv(".env.local")
if VENV_PATH:
    os.environ["PATH"] = f"{VENV_PATH}" + os.environ["PATH"]

# API Keys from environment variables
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
print("YouTube API KEY:", os.getenv("YOUTUBE_API_KEY"))

# YouTube API setup
api_service_name = "youtube"
api_version = "v3"
youtube = googleapiclient.discovery.build(api_service_name, api_version, developerKey=YOUTUBE_API_KEY)

# Gemini API setup
genai.configure(api_key=GEMINI_API_KEY)

# Initialize VADER sentiment analyzer
nltk.download('vader_lexicon')
sid = SentimentIntensityAnalyzer()

#########################
# Existing Analysis Functions
#########################
def get_comments(video_id):
    comments = []
    try:
        request_ = youtube.commentThreads().list(
            part="snippet",
            videoId=video_id,
            maxResults=100
        )
        while request_:
            response = request_.execute()
            for item in response['items']:
                comment = item['snippet']['topLevelComment']['snippet']
                comments.append([
                    comment['authorDisplayName'],
                    comment['publishedAt'],
                    comment['updatedAt'],
                    comment['likeCount'],
                    comment['textDisplay']
                ])
            if 'nextPageToken' in response:
                request_ = youtube.commentThreads().list(
                    part="snippet",
                    videoId=video_id,
                    maxResults=100,
                    pageToken=response['nextPageToken']
                )
            else:
                break
    except googleapiclient.errors.HttpError as e:
        return {"error": str(e)}
    
    df = pd.DataFrame(comments, columns=['author', 'published_at', 'updated_at', 'like_count', 'text'])

    top_n = 5
    top_comments = df.sort_values(by='like_count', ascending=False).head(top_n).to_dict(orient="records")

    # You can return both if needed
    return {
        "all_comments": df,
        "top_comments": top_comments
    }

def get_channel_comments_df(channel_url):
    channel_id = extract_channel_id(channel_url)
    if not channel_id:
        return None, "Invalid channel URL"

    videos = get_latest_videos_channel(channel_id, max_videos=10)
    all_comments = []

    for video_id, video_title in videos:
        comments = get_youtube_comments_channel(video_id, max_comments=100)
        all_comments.extend(comments)

    df = pd.DataFrame({'text': all_comments})
    return df, None

def get_channel_sentiment_summary_via_df(channel_url):
    df, error = get_channel_comments_df(channel_url)
    if error:
        return {"error": error}

    df = analyze_sentiment(df)

    sentiment_counts = df['sentiment_label'].value_counts().to_dict()
    top_positive = df[df['sentiment_label'] == 'positive']['text'].head(5).tolist()
    top_negative = df[df['sentiment_label'] == 'negative']['text'].head(5).tolist()

    return {
        "total_comments": len(df),
        "sentiment_counts": sentiment_counts,
        "top_positive_comments": top_positive,
        "top_negative_comments": top_negative
    }

def analyze_sentiment(df):
    df['sentiment'] = df['text'].apply(lambda text: sid.polarity_scores(text)['compound'])
    df['sentiment_label'] = df['sentiment'].apply(
        lambda score: 'positive' if score >= 0.05 else ('negative' if score <= -0.05 else 'neutral')
    )
    return df

def get_key_phrases(df, sentiment='negative', top_n=5):
    filtered_comments = df[df['sentiment_label'] == sentiment]['text']
    if len(filtered_comments) == 0:
        return []
    vectorizer = CountVectorizer(stop_words='english', ngram_range=(1, 2))
    X = vectorizer.fit_transform(filtered_comments)
    word_counts = pd.DataFrame(X.toarray(), columns=vectorizer.get_feature_names_out())
    top_phrases = word_counts.sum().sort_values(ascending=False).head(top_n).index.tolist()
    return top_phrases

def analyze_with_gemini(prompt):
    model = genai.GenerativeModel("gemini-2.0-flash")  # Use the Gemini model available
    response = model.generate_content(prompt)
    return response.text

def generate_summary_and_sentiment(comments):
    prompt = f"""Here are some YouTube comments:
    {comments}

    1. Provide a brief summary of the video's main topics in plain text.
    2. Identify the most repeated opinions or phrases.
    3. Determine the overall sentiment (positive, negative, neutral).
    4. Keep it short, about 100 words and do not add * for formatting.
    5. Format it with bullets using <b> tags for headings (e.g., <br><b>Summary:</b>, <br><b>Repeated Opinions:</b>, <br><b>Sentiment:</b>) instead of asterisks."""
    
    return analyze_with_gemini(prompt)

def generate_chatbot_response(video_summary, user_input):
    model = genai.GenerativeModel("gemini-2.0-flash")
    prompt = f"""
    You are an assistant helping users understand YouTube video summaries.

    Given the following summary:
    {video_summary}

    Please answer the following user question clearly and thoroughly:
    "{user_input}"

    **Formatting Instructions:**
    - Structure your answer in a list format (e.g., 1., 2., 3.).
    - Start each point from a new line.
    - Avoid HTML or markdown formatting other than **bold** with asterisks and numbered bullets.
    - Avoid using backticks (```) or <html> tags.

    Respond only in clean, readable plain text format.
    """
    
    response = model.generate_content(prompt)

    soup = BeautifulSoup(response.text, "html.parser")
    plain_text = soup.get_text(separator="\n")

    return plain_text.strip()

def generate_pdf_report(data):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    story.append(Paragraph("YouTube Comment Sentiment Analysis Report", styles['Title']))
    story.append(Spacer(1, 12))

    summary_text = f"Total Comments: {data['summary']['total']}<br/>Positive: {data['summary']['positive']}<br/>Negative: {data['summary']['negative']}<br/>Neutral: {data['summary']['neutral']}"
    story.append(Paragraph("Sentiment Summary", styles['Heading2']))
    story.append(Paragraph(summary_text, styles['Normal']))
    story.append(Spacer(1, 12))

    story.append(Paragraph("Top Negative Key Phrases", styles['Heading2']))
    phrases = ", ".join(data['key_phrases']) if data['key_phrases'] else "None detected"
    story.append(Paragraph(phrases, styles['Normal']))
    story.append(Spacer(1, 12))

    story.append(Paragraph("Suggestions", styles['Heading2']))
    story.append(Paragraph(data['suggestions'][0], styles['Normal']))
    story.append(Spacer(1, 12))

    story.append(Paragraph("Chatbot Summary", styles['Heading2']))
    story.append(Paragraph(data['chatbot_summary'], styles['Normal']))
    story.append(Spacer(1, 12))

    story.append(Paragraph("Top Comments", styles['Heading2']))
    top_comments = [[c['author'], c['text'], c['sentiment_label'], c['like_count']] for c in data['comments'][:5]]
    table_data = [['Author', 'Comment', 'Sentiment', 'Likes']] + top_comments
    table = Table(table_data, colWidths=[100, 200, 80, 50])
    table.setStyle([('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('GRID', (0, 0), (-1, -1), 1, colors.black)])
    story.append(table)

    doc.build(story)
    buffer.seek(0)
    return buffer

#########################
# Functions for Channel Analysis
#########################
def extract_channel_id(url):
    # Handle different URL formats for channel URL
    if "/channel/" in url:
        return url.split("/channel/")[-1]
    if "@" in url:
        handle = url.split("@")[-1]
        try:
            response = youtube.search().list(
                part="snippet",
                q=handle,
                type="channel",
                maxResults=1
            ).execute()
            return response["items"][0]["snippet"]["channelId"] if response["items"] else None
        except Exception as e:
            print(f"Error fetching channel ID: {e}")
            return None
    return None

def get_latest_videos_channel(channel_id, max_videos=10):
    try:
        request = youtube.search().list(
            part="id,snippet",
            channelId=channel_id,
            order="date",
            maxResults=max_videos
        )
        response = request.execute()
        videos = [(item['id']['videoId'], item['snippet']['title']) for item in response.get("items", []) if 'videoId' in item['id']]
        return videos
    except googleapiclient.errors.HttpError as e:
        print("Error fetching latest videos:", e)
        return []

def get_youtube_comments_channel(video_id, max_comments=100):
    comments = []
    try:
        request = youtube.commentThreads().list(
            part="snippet",
            videoId=video_id,
            maxResults=100
        )
        while request and len(comments) < max_comments:
            response = request.execute()
            for item in response.get("items", []):
                comment = item["snippet"]["topLevelComment"]["snippet"]["textDisplay"]
                comments.append(comment)
            request = youtube.commentThreads().list_next(request, response)
    except googleapiclient.errors.HttpError as e:
        print("Error fetching comments for video:", video_id, e)
    return comments[:max_comments]

def generate_creator_summary(video_data, comments):
   prompt = f"""
    You are analyzing a YouTube creator's content based on their latest videos and audience feedback.

    Here are the video titles and corresponding audience comments:
    {video_data}

    1. Summarize the type of content this creator produces.
    2. Identify what the audience loves most about their content.
    3. Highlight common criticisms or what the audience dislikes.
    4. Provide a concise and engaging summary in under 100 words.
    5. Do not add * for formatting
    6. Avoid HTML or markdown formatting other than **bold** with asterisks and numbered bullets.
    7. Avoid using backticks (```) or <html> ,<br> ,<b> tags.
    """
   raw_response = analyze_with_gemini(prompt)
   soup = BeautifulSoup(raw_response, "html.parser")
   return soup.get_text(separator="\n").strip()

@app.route('/channel_analysis', methods=['POST'])
def channel_analysis():
    data = request.get_json()
    channel_url = data.get('channel_url')
    if not channel_url:
        return jsonify({"error": "Missing channel URL"}), 400

    channel_id = extract_channel_id(channel_url)
    if not channel_id:
        return jsonify({"error": "Invalid channel URL"}), 400

    video_info = get_latest_videos_channel(channel_id, max_videos=10)
    if not video_info:
        return jsonify({"error": "No videos found for this channel."}), 404

    video_data = []
    all_comments = []
    for video_id, video_title in tqdm(video_info, desc="Processing videos"):
        comments = get_youtube_comments_channel(video_id)
        if comments:
            video_data.append((video_title, comments))
            all_comments.extend(comments)

    if not video_data:
        return jsonify({"error": "No comments found for analysis."}), 404

    # ✨ LLM-based content summary
    summary = generate_creator_summary(video_data, all_comments)

    # 🧠 Sentiment Analysis
    df = pd.DataFrame({'text': all_comments})
    df = analyze_sentiment(df)
    sentiment_counts = df['sentiment_label'].value_counts().to_dict()
    top_positive = df[df['sentiment_label'] == 'positive']['text'].head(5).tolist()
    top_negative = df[df['sentiment_label'] == 'negative']['text'].head(5).tolist()

    # 🔍 Key phrases and suggestions from negative comments
    key_phrases = get_key_phrases(df, 'negative')  # You should already have this function
    suggestions = (
        ["Consider addressing feedback about: " + ", ".join(key_phrases)]
        if key_phrases else ["No major negative themes detected."]
    )

    # 🤖 Chatbot-style summarization
    comments_list = df['text'].tolist()
    chatbot_summary = generate_summary_and_sentiment(comments_list)  # Gemini or other LLM-based

    return jsonify({
        "channel_id": channel_id,
        "summary": summary,
        "sentiment_analysis": {
            "total_comments": len(df),
            "sentiment_counts": sentiment_counts,
            "top_positive_comments": top_positive,
            "top_negative_comments": top_negative,
            "key_phrases": key_phrases,
            "suggestions": suggestions,
            "chatbot_summary": chatbot_summary
        }
    })

#########################
# Existing Endpoints
#########################
@app.route('/')
def home():
    return "YouTube Comment Sentiment Analysis API is running."

@app.route('/analysis', methods=['POST'])
def analyze():
    video_url = request.form.get('video_url') or (request.json and request.json.get('video_url'))
    print(video_url)
    parsed_url = urlparse(video_url)
    video_id = parse_qs(parsed_url.query).get('v', [None])[0]

    if not video_id:
        return jsonify({"error": "Invalid YouTube URL"}), 400

    data = get_comments(video_id)

    if isinstance(data, dict) and "error" in data:
        return jsonify(data), 500

    df = data["all_comments"]
    top_comments = data["top_comments"]

    # Sentiment Analysis
    df = analyze_sentiment(df)

    sentiment_summary = {
        "positive": len(df[df['sentiment_label'] == 'positive']),
        "negative": len(df[df['sentiment_label'] == 'negative']),
        "neutral": len(df[df['sentiment_label'] == 'neutral']),
        "total": len(df)
    }

    key_phrases = get_key_phrases(df, 'negative')
    suggestions = ["Consider addressing feedback about: " + ", ".join(key_phrases)] if key_phrases else ["No major negative themes detected."]

    comments_list = df['text'].tolist()
    chatbot_summary = generate_summary_and_sentiment(comments_list)

    result = df.to_dict(orient='records')

    return jsonify({
        "comments": result,
        "summary": sentiment_summary,
        "key_phrases": key_phrases,
        "suggestions": suggestions,
        "chatbot_summary": chatbot_summary,
        "top_comments": top_comments,
        "video_url": video_url
    })

@app.route('/chatbot', methods=['POST'])
def chatbot_endpoint():
    data = request.get_json()

    # ✅ Accept both video_summary or creator_summary as chatbot_summary
    chatbot_summary = data.get('chatbot_summary') or data.get('video_summary') or data.get('creator_summary')
    user_input = data.get('user_input')

    if not chatbot_summary or not user_input:
        return jsonify({"error": "Missing summary or user input"}), 400

    response = generate_chatbot_response(chatbot_summary, user_input)
    soup = BeautifulSoup(response, "html.parser")
    plain_text = soup.get_text()
    return jsonify({"response": plain_text})

@app.route('/download_report', methods=['POST'])
def download_report():
    data = request.get_json()
    pdf_buffer = generate_pdf_report(data)
    return send_file(pdf_buffer, as_attachment=True, download_name="sentiment_report.pdf", mimetype="application/pdf")

if __name__ == "__main__":
    serve(app, host="0.0.0.0", port=5000)
