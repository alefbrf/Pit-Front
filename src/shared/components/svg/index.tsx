interface SVGComponentProps {
    width: number | string;
    height: number | string;
    children: React.ReactNode;
    viewBox?: string;
}

export default function SVGComponent({ width, height, viewBox = "0 0 24 24", children } : SVGComponentProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox={viewBox}
            xmlns="http://www.w3.org/2000/svg"
        >
            {children}
        </svg>
    )
}