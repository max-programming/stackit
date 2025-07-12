interface QuestionHeaderProps {
  title: string;
  description: string;
}

export function QuestionHeader({ title, description }: QuestionHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold text-foreground mb-2">{title}</h1>
      <p className="text-muted-foreground text-lg">{description}</p>
    </div>
  );
}
