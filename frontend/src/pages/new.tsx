import { QueryClient, QueryClientProvider, useQuery } from "react-query";

const queryClient = new QueryClient();

export default function New() {
	return (
		<QueryClientProvider client={queryClient}>
			<Example />
		</QueryClientProvider>
	);
}

const Example: React.FC = () => {
	const { isLoading, error, data } = useQuery("repoData", () =>
		fetch("https://api.github.com/repos/tannerlinsley/react-query").then(
			(res) => res.json()
		)
	);

	if (isLoading) return <>Loading...</>;

	if (error) return <>{`An error has occurred: ${error}`}</>;

	return (
		<div>
			<h1>{data.name}</h1>
			<p>{data.description}</p>
			<strong>👀 {data.subscribers_count}</strong>{" "}
			<strong>✨ {data.stargazers_count}</strong>{" "}
			<strong>🍴 {data.forks_count}</strong>
		</div>
	);
};
