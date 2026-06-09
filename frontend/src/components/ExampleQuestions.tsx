const ExampleQuestions = () => {
  const questions = [
    "How does authentication work?",
    "Explain the repository indexing workflow.",
    "Which files are responsible for AI responses?",
    "Show me the complete chat creation flow.",
    "How is RabbitMQ integrated in this project?",
    "Find all API endpoints related to repositories.",
    "Explain the project architecture.",
    "Which services use Socket.io?",
  ];

  return (
    <section className="px-6 py-10 bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <span
            className="
    rounded-full
    border
    border-primary/20
    bg-primary/10
    px-4
    py-2
    text-sm
    font-medium
    text-primary
  "
          >
            Example Questions
          </span>

          <h2 className="mt-6 text-4xl font-bold text-foreground md:text-5xl">
            Ask Anything About Your Codebase
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Explore repositories using natural language. Here are some examples
            of what you can ask.
          </p>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-2">
          {questions.map((question) => (
            <div
              key={question}
              className="
    group
    cursor-pointer
    rounded-2xl
    border
    border-border
    bg-card
    p-5
    transition-all
    duration-300
    hover:border-primary
    hover:-translate-y-1
  "
            >
              <div className="flex items-start gap-4">
                <div
                  className="
        flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center
        rounded-xl
        bg-primary/10
        text-primary
      "
                >
                  💬
                </div>

                <p
                  className="
        font-medium
        text-card-foreground
        transition-colors
        group-hover:text-primary
      "
                >
                  {question}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExampleQuestions;
