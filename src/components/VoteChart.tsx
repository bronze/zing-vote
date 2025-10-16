import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface VoteChartProps {
  questionId: string;
  optionA: string;
  optionB: string;
}

interface SnapshotData {
  timestamp: string;
  percentage_a: number;
  percentage_b: number;
}

export const VoteChart = ({ questionId, optionA, optionB }: VoteChartProps) => {
  const [data, setData] = useState<SnapshotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSnapshots = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all snapshots
        const { data: snapshots, error: snapshotError } = await supabase
          .from('vote_snapshots')
          .select('*')
          .eq('question_id', questionId)
          .order('timestamp', { ascending: true });

        if (snapshotError) throw snapshotError;

        if (!snapshots || snapshots.length === 0) {
          setError('Dados insuficientes para exibir o gráfico');
          setLoading(false);
          return;
        }

        // Group by day - keep only the last snapshot of each day
        const dailyMap = new Map<string, any>();
        snapshots.forEach(snapshot => {
          const date = new Date(snapshot.timestamp);
          const dayKey = format(date, 'yyyy-MM-dd');
          // This will overwrite previous snapshots from same day, keeping only the last
          dailyMap.set(dayKey, snapshot);
        });

        const dailySnapshots = Array.from(dailyMap.values());
        
        if (dailySnapshots.length < 2) {
          setError('Dados insuficientes para exibir o gráfico');
          setLoading(false);
          return;
        }

        // Transform data to percentages
        const chartData = dailySnapshots.map(snapshot => {
          const total = snapshot.votes_a + snapshot.votes_b;
          const percentage_a = total > 0 ? (snapshot.votes_a / total) * 100 : 50;
          const percentage_b = total > 0 ? (snapshot.votes_b / total) * 100 : 50;

          return {
            timestamp: snapshot.timestamp,
            percentage_a: Math.round(percentage_a * 10) / 10,
            percentage_b: Math.round(percentage_b * 10) / 10,
          };
        });

        setData(chartData);
      } catch (err) {
        console.error('Error fetching vote snapshots:', err);
        setError('Erro ao carregar dados do gráfico');
      } finally {
        setLoading(false);
      }
    };

    fetchSnapshots();
  }, [questionId]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(payload[0].payload.timestamp);
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-xs text-muted-foreground mb-2">
            {format(date, "dd 'de' MMM", { locale: ptBR })}
          </p>
          <p className="text-sm font-medium" style={{ color: 'hsl(var(--vote-sim))' }}>
            {optionA}: {payload[0].value}%
          </p>
          <p className="text-sm font-medium" style={{ color: 'hsl(var(--vote-nao))' }}>
            {optionB}: {payload[1].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="text-lg">Evolução dos votos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Carregando gráfico...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="text-lg">Evolução dos votos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground text-sm">{error}</p>
              <p className="text-xs text-muted-foreground">
                O gráfico será exibido quando houver dados suficientes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader>
        <CardTitle className="text-lg">Evolução dos votos ao longo do tempo</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(timestamp) => format(new Date(timestamp), "dd/MM", { locale: ptBR })}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="percentage_a" 
              stroke="hsl(var(--vote-sim))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--vote-sim))', r: 3 }}
              name={optionA}
              animationDuration={500}
            />
            <Line 
              type="monotone" 
              dataKey="percentage_b" 
              stroke="hsl(var(--vote-nao))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--vote-nao))', r: 3 }}
              name={optionB}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
        
        {/* Legend */}
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--vote-sim))' }} />
            <span className="text-sm text-muted-foreground">{optionA}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(var(--vote-nao))' }} />
            <span className="text-sm text-muted-foreground">{optionB}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};