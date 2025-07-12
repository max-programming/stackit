"use client";

import React, { useState } from "react";
import { SerializedEditorState } from "lexical";
import { Editor } from "~/components/blocks/editor-x/editor";

const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "Hello World 🚀",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState;

function Page() {
  const [editorState, setEditorState] =
    useState<SerializedEditorState>(initialValue);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="w-full max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-10">Ask Question</h1>
        <form className="flex flex-col gap-8">
          <div>
            <label htmlFor="title" className="block text-lg font-semibold mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full px-4 py-3 bg-input text-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-base"
              placeholder="Enter your question title..."
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-lg font-semibold mb-2"
            >
              Description
            </label>
            <div className="w-full h-48 overflow-y-auto bg-input text-foreground border border-border rounded-md">
              <Editor
                editorSerializedState={editorState}
                onSerializedChange={(value) => setEditorState(value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="tags" className="block text-lg font-semibold mb-2">
              Tags
            </label>
            <input
              id="tags"
              type="text"
              className="w-full px-4 py-3 bg-input text-foreground border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-base"
              placeholder="Enter tags separated by commas..."
            />
          </div>

          <div className="flex justify-start">
            <button
              type="submit"
              className="px-10 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background text-lg font-semibold transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Page;
