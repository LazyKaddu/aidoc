import { useState } from 'react'
import axios from 'axios'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [search, setSearch] = useState('')
  const [diagnosis, setDiagnosis] = useState(null)
  const [Witty, setWitty] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const API_URL = "https://openrouter.ai/api/v1/chat/completions";
  const API_KEY = "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"
  const getCreative = () => {
    setIsLoading(true)
    axios.post(
      API_URL,
      {
        model: "mistralai/Mistral-7B-Instruct",
        messages: [{
          role: "user", content: `You are an AI medical assistant that helps diagnose conditions and suggests medications based on symptoms. Please analyze the following symptoms and provide a diagnosis along with recommended medications.

Task:
Analyze the provided symptoms
Suggest possible conditions
Recommend appropriate medications
Provide important warnings and precautions

Response Format:
{
  "possibleConditions": ["<condition1>", "<condition2>", ...],
  "recommendedMedications": [
    {
      "name": "<medication_name>",
      "dosage": "<recommended_dosage>",
      "frequency": "<how_often_to_take>",
      "duration": "<how_long_to_take>"
    }
  ],
  "warnings": ["<warning1>", "<warning2>", ...],
  "precautions": ["<precaution1>", "<precaution2>", ...]
}

Important Notes:
- Always include a disclaimer that this is AI-generated advice and should be verified by a healthcare professional
- Include common over-the-counter medications when appropriate
- List potential side effects and interactions
- Recommend seeking immediate medical attention for severe symptoms

userSymptoms = ${search}`
        }]
      },
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    ).then((e) => {
      console.log(e.data.choices[0].message.content)
      setWitty(JSON.parse(e.data.choices[0].message.content))
      console.log(Witty)
      console.log(Witty)
      // Display the results in the UI instead of redirecting to Google
      setDiagnosis(Witty)
    }).catch((e) => {
      alert(e)
    }).finally(() => {
      setIsLoading(false)
    })
  }
  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-gray-800 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg 
              className="h-8 w-8 text-blue-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span className="text-xl font-bold text-white">AI Doctor</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-blue-400 transition-colors">Home</a>
            <a href="#" className="hover:text-blue-400 transition-colors">About</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Services</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
          </div>
          <div className="md:hidden">
            <button className="text-white hover:text-blue-400 transition-colors">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4 text-white">AI Doctor</h1>
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Describe your symptoms..."
            className="flex-1 p-2 border rounded bg-gray-800 text-white border-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={getCreative}
            disabled={isLoading}
            className={`bg-blue-600 text-white px-6 py-2 rounded transition-colors whitespace-nowrap flex items-center gap-2 ${
              isLoading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              'Get Diagnosis'
            )}
          </button>
        </div>

        {diagnosis && (
          <div className="mt-4 p-4 border rounded bg-gray-800 border-gray-700">
            <h2 className="text-xl font-bold mb-2 text-white">Possible Conditions:</h2>
            <ul className="list-disc pl-5 text-gray-300">
              {diagnosis.possibleConditions.map((condition, index) => (
                <li key={index}>{condition}</li>
              ))}
            </ul>

            <h2 className="text-xl font-bold mt-4 mb-2 text-white">Recommended Medications:</h2>
            <ul className="list-disc pl-5 text-gray-300">
              {diagnosis.recommendedMedications.map((med, index) => (
                <li key={index}>
                  {med.name} - {med.dosage} ({med.frequency}) for {med.duration}
                </li>
              ))}
            </ul>

            <h2 className="text-xl font-bold mt-4 mb-2 text-white">Warnings:</h2>
            <ul className="list-disc pl-5 text-gray-300">
              {diagnosis.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>

            <h2 className="text-xl font-bold mt-4 mb-2 text-white">Precautions:</h2>
            <ul className="list-disc pl-5 text-gray-300">
              {diagnosis.precautions.map((precaution, index) => (
                <li key={index}>{precaution}</li>
              ))}
            </ul>

            <div className="mt-4 p-4 bg-gray-700 rounded">
              <p className="font-bold text-white">Important Disclaimer:</p>
              <p className="text-gray-300">This is AI-generated medical advice and should be verified by a healthcare professional. Always consult with a doctor before starting any medication.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
