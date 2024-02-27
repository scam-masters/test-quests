export default function SearchResultsComponent({ results }) {
    return (
        <div className="p-4 max-w-screen-xl m-auto">
            <div className="tq-black rounded-lg text-center overflow-hidden text-tq-white border-2 border-tq-primary">
                <h1 className="text-2xl font-bold py-2 px-4 bg-tq-primary text-tq-white text-center">RESULTS</h1>
                <table className="searchResults">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            results.map((entry, index) => (
                                <tr key={index}>
                                    <td title="View the profile" className="underline text-sky-400"><a href={`/profile/${entry.username}`}>{entry.username}</a></td>
                                    {/* avoid showing -1 as score */}
                                    <td>{entry.score == -1 ? 0 : entry.score}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}
