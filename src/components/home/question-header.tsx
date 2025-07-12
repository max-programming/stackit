interface QuestionHeaderProps {
  title: string;
  description: string;
}

export function QuestionHeader({ title, description }: QuestionHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
        {title}
      </h1>
      <p className="text-muted-foreground text-base sm:text-lg">
        {description}
      </p>
    </div>
  );
}
