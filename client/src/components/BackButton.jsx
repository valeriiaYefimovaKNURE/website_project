import { useNavigate } from "react-router-dom";

export default function BackButton({ to = "/" }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="absolute top-8 left-8 flex items-center gap-2 
                 bg-white text-gray-700 px-4 py-2 rounded-lg
                 shadow hover:bg-gray-160 transition-colors font-medium text-lg"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
          clipRule="evenodd"
        />
      </svg>
      На головну
    </button>
  );
}