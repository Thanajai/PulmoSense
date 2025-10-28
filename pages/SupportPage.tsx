
import React from 'react';
import GlassCard from '../components/GlassCard';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => (
  <div className="border-b border-gray-200 py-4">
    <h3 className="font-semibold text-gray-900">{question}</h3>
    <p className="text-gray-600 mt-1">{answer}</p>
  </div>
);

const SupportPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold font-poppins text-gray-900 mb-6">Support & FAQ</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <GlassCard>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <FAQItem
              question="How do I connect my PulmoSense Lite device?"
              answer="Navigate to the Home page and click the 'Connect Device' button. Ensure your device is powered on and within range. Your browser may ask for permission to access Bluetooth or Serial ports."
            />
            <FAQItem
              question="What do the sensor readings mean?"
              answer="The dashboard shows readings from three different sensors. MQ-135 measures general air quality (impurities like smoke, benzene, and other VOCs). MQ-3 specifically detects alcohol levels. MQ-7 is for carbon monoxide (CO). The app provides a simple interpretation: Green for normal, Yellow for slight elevation, and Red for high levels."
            />
            <FAQItem
              question="Is my data secure?"
              answer="All session data is stored locally on your device's browser storage. We do not transmit your personal health data to our servers for PulmoSense Lite."
            />
             <FAQItem
              question="How can I export my data?"
              answer="On the Dashboard page, you will find an 'Export' button. This feature will be enabled in a future update, allowing you to download your session data as a CSV file."
            />
          </GlassCard>
        </div>
        <div className="lg:col-span-2">
          <GlassCard>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Support</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
                <input type="text" id="name" className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" id="email" className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea id="message" rows={4} className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"></textarea>
              </div>
              <div>
                <button type="submit" className="w-full px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600 transition-colors">
                  Send Message
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;