import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { opentotalkInsights } from '../services/apis';

const screenWidth = Dimensions.get('window').width;

const useInsights = () => {
  const [moodChartData, setMoodChartData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0, 0, 0],
        color: () => 'white',
        strokeWidth: 3,
      },
    ],
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [chatMatches, setChatMatches] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const chartConfig = {
    backgroundColor: 'transparent',
    backgroundGradientFrom: 'transparent',
    backgroundGradientTo: 'transparent',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
    labelColor: () => '#b3b3b3',
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#fff',
      fill: '#4CAF50',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: 'rgba(255,255,255,0.1)',
      strokeWidth: 1,
    },
  };

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await opentotalkInsights();
        // Map graph data to chart format
        if (res.graph && Array.isArray(res.graph)) {
          setMoodChartData({
            labels: res.graph.map((point: any) => point.x),
            datasets: [
              {
                data: res.graph.map((point: any) => point.y),
                color: () => 'white',
                strokeWidth: 3,
              },
            ],
          });
        }
        // Map AI suggestions
        if (res.aiSuggestions && Array.isArray(res.aiSuggestions)) {
          setSuggestions(res.aiSuggestions.map((s: any) => s.suggestion));
        }
        // Set chat matches
        if (typeof res.chatMatches === 'number') {
          setChatMatches(res.chatMatches);
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load insights.');
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  return { moodChartData, chartConfig, suggestions, chatMatches, loading, error };
};

export default useInsights;
