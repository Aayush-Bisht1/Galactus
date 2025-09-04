import react from "react";
import { Calendar, Mail, Phone, Scissors } from "lucide-react";

const ContactSection = () => {
  return (
     <section className=" text-white  text-center mb-2">
      <div className=" mx-auto max-w-[90%] bg-gradient-to-r from-blue-700 to-green-600 py-16 px-16 rounded-md">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Train Scheduling Management
        </h2>
        <p className="text-lg md:text-xl text-gray-200 mb-8 px-8">
           KMRL is revolutionizing train scheduling with intelligent,
          data-driven decisions. This platform can optimize the
          operations and improve service reliability.
        </p>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
          <button className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition">
            <Calendar className="w-5 h-5" />
            Live Schedule
          </button>
          <button className="flex items-center justify-center gap-2 border border-gray-300 text-white hover:bg-gray-100 hover:text-gray-900 font-semibold px-6 py-3 rounded-lg transition">
            <Mail className="w-5 h-5" />
            Contact Support
          </button>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Direct Contact */}
          <div>
            <div className="flex justify-center mb-3">
              <Phone className="w-10 h-10 text-white bg-white/20 rounded-lg p-2" />
            </div>
            <h3 className="text-lg font-semibold">Direct Contact</h3>
            <p className="text-gray-200 text-sm">
              Connect with our transportation experts
            </p>
          </div>

          {/* Live Demo */}
          <div>
            <div className="flex justify-center mb-3">
              <Calendar className="w-10 h-10 text-white bg-white/20 rounded-lg p-2" />
            </div>
            <h3 className="text-lg font-semibold">Live Updates</h3>
            <p className="text-gray-200 text-sm">
              See the platform in action with your data
            </p>
          </div>

          {/* Custom Solution */}
          <div>
            <div className="flex justify-center mb-3">
              <Mail className="w-10 h-10 text-white bg-white/20 rounded-lg p-2" />
            </div>
            <h3 className="text-lg font-semibold"> Solution</h3>
            <p className="text-gray-200 text-sm">
              Tailored implementation for KMRL
            </p>
          </div>
        </div>
      </div>
    </section>  );
};

export default ContactSection;
