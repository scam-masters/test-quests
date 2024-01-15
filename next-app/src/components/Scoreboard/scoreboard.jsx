import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import Button from '@/components/button/button';

export default function ScoreboardComponent({ scoreboardData }) {
    return (
        <div className="p-4 max-w-screen-xl m-auto">
            <div className="tq-black rounded-lg text-center overflow-hidden text-tq-white border-2 border-tq-primary">
                <h1 className="text-2xl font-bold py-2 px-4 bg-tq-primary text-tq-white text-center">SCOREBOARD</h1>
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 text-left text-xl font-semibold uppercase text-center tracking-wider">Username</th>
                            <th className="px-5 py-3 text-left text-xl font-semibold uppercase text-center tracking-wider">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            scoreboardData.map((entry, index) => (
                                <tr key={index}>
                                    <td className="px-5 py-2">{entry.user}</td>
                                    <td className="px-5 py-2">{entry.score}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}
