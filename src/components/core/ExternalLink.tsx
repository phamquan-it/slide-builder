type Props = {
    title: string;
    description: string;
    href: string;
};

export default function ExternalLink({ description, href, title }: Props) {
    return (
        <a
            className=""
            href={href}
            rel="noreferrer"
            target="_blank"
        >
            <p className="text-xl font-semibold">
                {title} <span className="ml-2 inline-block">→</span>
            </p>
            <p className="mt-2 max-w-[250px] text-gray-400">{description}</p>
        </a>
    );
}
