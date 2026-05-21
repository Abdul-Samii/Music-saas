import ArticlesIndex from "@/page-components/articles";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Articles",
	description: "Articles",
};

const Page = () => {
	return <ArticlesIndex />;
};

export default Page;
