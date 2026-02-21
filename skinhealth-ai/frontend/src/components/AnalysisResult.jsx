import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function AnalysisResult() {
  const { id } = useParams();
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await api.get(`/api/analysis/${id}`); // need endpoint
        setAnalysis(res.data);
      } catch (err) {
        toast.error('Failed to load analysis');
      }
    };
    fetchAnalysis();
  }, [id]);

  if (!analysis) return <div className="p-4">Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Analysis Result</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <img src={`http://localhost:5000/uploads/${analysis.image}`} alt="Uploaded" className="w-full rounded shadow" />
          {analysis.heatmap && (
            <img src={`http://localhost:5000/uploads/${analysis.heatmap}`} alt="Heatmap" className="w-full rounded shadow mt-4" />
          )}
        </div>
        <div>
          <p className="text-xl"><strong>Disease:</strong> {analysis.prediction}</p>
          <p className="text-xl"><strong>Severity:</strong> 
            <span className={`ml-2 px-2 py-1 rounded ${
              analysis.severity === 'High' ? 'bg-red-200' : analysis.severity === 'Medium' ? 'bg-yellow-200' : 'bg-green-200'
            }`}>
              {analysis.severity}
            </span>
          </p>
          <p className="mt-4"><strong>First Aid:</strong> {analysis.first_aid}</p>
          <p className="mt-2 text-sm text-gray-600">* This is not professional medical advice.</p>

          {(analysis.severity === 'Medium' || analysis.severity === 'High') && (
            <div className="mt-6">
              <Link to={`/consult/${analysis.id}`} className="bg-blue-600 text-white px-6 py-3 rounded inline-block">
                Contact a Dermatologist
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}