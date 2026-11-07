import { H1, H2, H3, H4, Paragraph, styled, type ParagraphProps } from "tamagui";

/** Body text with semantic tones. */
export const BodyText = styled(Paragraph, {
  name: "BodyText",
  color: "text",
  variants: {
    tone: {
      default: { color: "text" },
      muted: { color: "muted" },
      error: { color: "error" },
      success: { color: "success" },
    },
  } as const,
  defaultVariants: { tone: "default" },
});

export type BodyTextProps = ParagraphProps & { tone?: "default" | "muted" | "error" | "success" };

const headingByLevel = { 1: H1, 2: H2, 3: H3, 4: H4 } as const;

export interface HeadingProps {
  level?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  id?: string;
}

/** Semantic heading (renders h1–h4 on the web, accessible header role on native). */
export function Heading({ level = 2, children, id }: HeadingProps) {
  const Component = headingByLevel[level];
  return (
    <Component id={id} color="text" role="heading" aria-level={level}>
      {children}
    </Component>
  );
}
