import React from "react";
import { FiUser, FiBookOpen } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/Logo.png";
import Navbar from "../../components/BeforeLogin/Navbar";

const UserTypeCard = ({ icon: Icon, title, description, color, onClick }) => {

  const colorStyles = {
    blue: {
      gradient: "from-blue-100 to-blue-200",
      text: "text-blue-600",
      border: "hover:border-blue-600",
      shadow: "hover:shadow-blue-500/20",
    },
    orange: {
      gradient: "from-orange-100 to-orange-200",
      text: "text-orange-600",
      border: "hover:border-orange-600",
      shadow: "hover:shadow-orange-500/20",
    },
  };

  const currentStyle = colorStyles[color] || colorStyles.orange;
  return (
    <button
      onClick={onClick}
      className={`group w-full bg-white rounded-2xl shadow-lg p-8 text-center transition-all duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-2xl ${currentStyle.border} ${currentStyle.shadow} border-2 border-transparent`}
    >
      {/* Icon Wrapper */}
      <div
        className={`w-24 h-24 mx-auto bg-gradient-to-br ${currentStyle.gradient} rounded-full flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon className={`${currentStyle.text}`} size={48} />
      </div>

      {/* Card Content */}
      <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{description}</p>
      
      {/* Arrow Indicator on Hover */}
      <div className="mt-6 text-lg font-semibold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        Continue
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </button>
  );
};

function Selection() {
  const navigate = useNavigate();

  const userTypes = [
    {
      type: "student",
      icon: FiBookOpen,
      title: "I am a Student",
      description: "Access your courses, view grades, and submit assignments.",
      color: "blue",
    },
    {
      type: "instructor",
      icon: FiUser,
      title: "I am an Instructor",
      description: "Manage your classes, create content, and grade submissions.",
      color: "orange",
    },
  ];

  const handleSelectUserType = (userType) => {
    navigate(`/login/${userType}`);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#fff8f2] bg-[radial-gradient(#ffd5b1_1px,transparent_1px)] [background-size:24px_24px] flex items-center justify-center p-4">
        <div className="max-w-4xl w-full mx-auto">
          <header className="text-center mb-12">
            <img src={Logo} alt="Bricks Education Logo" className="w-28 h-auto mx-auto mb-4 rounded-md shadow-sm" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              Join <span className="text-orange-600">Bricks Education</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Please choose your role to get started.
            </p>
          </header>

          <main className="grid md:grid-cols-2 gap-8">
            {userTypes.map((user) => (
              <UserTypeCard
                key={user.type}
                icon={user.icon}
                title={user.title}
                description={user.description}
                color={user.color}
                onClick={() => handleSelectUserType(user.type)}
              />
            ))}
          </main>
        </div>
      </div>
    </>
  );
}

export default Selection;