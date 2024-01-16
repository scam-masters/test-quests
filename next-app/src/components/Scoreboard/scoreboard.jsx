import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import Button from '@/components/button/button';

export default function ScoreboardComponent({ scoreboardData }) {
    return (
        <div className="p-4 max-w-screen-xl m-auto">
            <div className="tq-black rounded-lg text-center overflow-hidden text-tq-white border-2 border-tq-primary">
                <h1 className="text-2xl font-bold py-2 px-4 bg-tq-primary text-tq-white text-center">SCOREBOARD</h1>
                <table className="scoreboard">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Score</th>
                            <th>Completed missions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            scoreboardData.map((entry, index) => (
                                <tr key={index}>
                                    <td>{entry.user}</td>
                                    <td>{entry.score}</td>
                                    <td>{entry.completedCount}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}
