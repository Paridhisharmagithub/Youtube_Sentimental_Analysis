
'use client'
import Navbar from "../../components/Navbar";
import Footer from "../../components/ui/footer";
import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { motion } from 'framer-motion';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { name, email, message } = formData;

        const templateParams = {
            from_name: name,
            from_email: email,
            message: message,
            to_name: "diyachakra.369@gmail.com",
        };

        emailjs
            .send('service_n9x8gjf', 'template_3agdnfp', templateParams, 'mSSWtrKeNTOoMDp30')
            .then(
                (result) => {
                    console.log('Email successfully sent:', result.text);
                },
                (error) => {
                    console.log('Email sending error:', error.text);
                }
            );

        setFormData({
            name: '',
            email: '',
            message: '',
        });
    };

    return (
        <div>
            <Navbar />
            <div className=" min-h-screen font-fell flex flex-col items-center justify-center pt-40 pb-30 bg-gradient-to-br from-gray-50 to-gray-100">
            
                <motion.h1
                    className="font-bold italic lg:text-5xl md:text-4xl sm:text-3xl  text-center"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Contact Us!
                </motion.h1>
                <motion.p
                    className="lg:text-xl md:text-xl sm:text-xl text-center mt-4 text-[#5D6166]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    We value your feedback and response. <br/> Any questions or remarks? Just write us a message!
                </motion.p>
                <motion.div
                    className="mt-10 w-lg max-w-3xl bg-white rounded-lg p-8 shadow-lg items-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <h2 className="text-3xl font-bold mb-4 text-center text-[#508C9B]">Get In Touch</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col">
                            <label className="text-lg font-semibold mb-2 ">Your Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="p-3 rounded-md border-2 border-[#508C9B] "
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-lg font-semibold mb-2">Your Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="p-3 rounded-md border-2 border-[#508C9B] "
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-lg font-semibold mb-2">Your Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                className="p-3 rounded-md border-2 border-[#508C9B] "
                                rows="4"
                                placeholder="Type your message"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-5 py-3 mt-6 bg-[#508C9B] hover:bg-[#134B70] transition duration-300 text-white font-semibold rounded-md text-lg "
                        >
                            Send Message
                        </button>
                    </form>
                </motion.div>
            </div>
            <Footer/>
        </div>
        
    );
}

