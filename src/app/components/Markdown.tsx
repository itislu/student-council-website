import ReactMarkdown, { Options } from 'react-markdown';
import { H1 } from './ui/H1';
import { H2 } from './ui/H2';
import { H3 } from './ui/H3';
import { H4 } from './ui/H4';
import classNames from 'classnames';
import { Blockquote } from './ui/Blockquote';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export function Markdown(props: Options) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
                blockquote(props) {
                    const { node, children, ...rest } = props;

                    return <Blockquote {...rest}>{children}</Blockquote>;
                },

                code(props) {
                    const { children, className, node, ...rest } = props;
                    const match = /language-(\w+)/.exec(className || '');

                    return match ? (
                        <code {...rest} className={className}>
                            {children}
                        </code>
                    ) : (
                        <code {...rest} className={classNames('bg-slate-200 rounded', className)}>
                            {children}
                        </code>
                    );
                },

                h1(props) {
                    const { node, children, ...rest } = props;

                    return <H1 {...rest}>{children}</H1>;
                },
                h2(props) {
                    const { node, children, ...rest } = props;

                    return <H2 {...rest}>{children}</H2>;
                },
                h3(props) {
                    const { node, children, ...rest } = props;

                    return <H3 {...rest}>{children}</H3>;
                },
                h4(props) {
                    const { node, children, ...rest } = props;

                    return <H4 {...rest}>{children}</H4>;
                },
                h5(props) {
                    const { node, children, ...rest } = props;

                    return <H4 {...rest}>{children}</H4>;
                },
                h6(props) {
                    const { node, children, ...rest } = props;

                    return <H4 {...rest}>{children}</H4>;
                },
                a(props) {
                    const { node, children, ...rest } = props;

                    return (
                        <a {...rest} className="text-blue-600 hover:underline">
                            {children}
                        </a>
                    );
                },
                em(props) {
                    const { node, children, ...rest } = props;

                    return <em {...rest}>{children}</em>;
                },
                strong(props) {
                    const { node, children, ...rest } = props;

                    return <strong {...rest}>{children}</strong>;
                },
                del(props) {
                    const { node, children, ...rest } = props;

                    return <del {...rest}>{children}</del>;
                },
                hr(props) {
                    const { node, ...rest } = props;

                    return <hr {...rest} className="my-4" />;
                },
                ul(props) {
                    const { node, children, ...rest } = props;

                    return <ul {...rest} className="list-disc list-inside">{children}</ul>;
                },
                ol(props) {
                    const { node, children, ...rest } = props;

                    return <ol {...rest} className="list-decimal list-inside">{children}</ol>;
                },
                li(props) {
                    const { node, children, ...rest } = props;

                    return <li {...rest}>{children}</li>;
                },
                table(props) {
                    const { node, children, ...rest } = props;

                    return <table {...rest} className="table-auto">{children}</table>;
                },
                thead(props) {
                    const { node, children, ...rest } = props;

                    return <thead {...rest} className="bg-gray-200">{children}</thead>;
                },
                tbody(props) {
                    const { node, children, ...rest } = props;

                    return <tbody {...rest}>{children}</tbody>;
                },
                tr(props) {
                    const { node, children, ...rest } = props;

                    return <tr {...rest} className="border-b">{children}</tr>;
                },
                th(props) {
                    const { node, children, ...rest } = props;

                    return <th {...rest} className="px-4 py-2">{children}</th>;
                },
                td(props) {
                    const { node, children, ...rest } = props;

                    return <td {...rest} className="px-4 py-2">{children}</td>;
                },
            }}
            {...props}
        />
    );
}
