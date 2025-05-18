import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import { useState, useRef } from "react";
import TextAlign from "@tiptap/extension-text-align";
import { FontSize } from "./fontSize";

export default function EditorComponent({
  content,
  onUpdate,
}: {
  content: string;
  onUpdate: (content: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      FontSize,
      Image,
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) {
    return null;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        editor.chain().focus().setImage({ src: base64Image }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="editor-container border rounded-[12px] p-4">
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={` h-10 px-3 transition-background duration-500 bg-[#ffcf9d] hover:scale-[1.04] hover:bg-[#FF962C] rounded-[10px] ${
            editor.isActive("bold") ? "bg-gray-200" : ""
          }`}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`h-10 px-3 transition-background duration-500 bg-[#ffcf9d] hover:scale-[1.04] hover:bg-[#FF962C] rounded-[10px] ${
            editor.isActive("italic") ? "bg-gray-200" : ""
          }`}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`h-10 px-3 transition-background duration-500 bg-[#ffcf9d] hover:scale-[1.04] hover:bg-[#FF962C] rounded-[10px] ${
            editor.isActive("bulletList") ? "bg-gray-200" : ""
          }`}
        >
          • List
        </button>
        {/* Кнопки выравнивания */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`h-10 px-3 transition-background duration-500 bg-[#ffcf9d] hover:scale-[1.04] hover:bg-[#FF962C] rounded-[10px] ${
            editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
          }`}
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`h-10 px-3 transition-background duration-500 bg-[#ffcf9d] hover:scale-[1.04] hover:bg-[#FF962C] rounded-[10px] ${
            editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
          }`}
        >
          ↔
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`h-10 px-3 transition-background duration-500 bg-[#ffcf9d] hover:scale-[1.04] hover:bg-[#FF962C] rounded-[10px] ${
            editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
          }`}
        >
          →
        </button>

        {/* Выбор размера шрифта */}
        <select
          onChange={(e) => {
            const size = e.target.value;
            if (size === "unset") {
              editor.chain().focus().unsetFontSize().run();
            } else {
              editor.chain().focus().setFontSize(size).run();
            }
          }}
          className="border p-1 rounded"
        >
          <option value="unset">Размер текста</option>
          <option value="12px">Мелкий</option>
          <option value="16px">Обычный</option>
          <option value="20px">Средний</option>
          <option value="24px">Крупный</option>
          <option value="32px">Очень крупный</option>
        </select>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`h-10 px-3 transition-background duration-500 bg-[#ffcf9d] hover:scale-[1.04] hover:bg-[#FF962C] rounded-[10px] ${
            editor.isActive("orderedList") ? "bg-gray-200" : ""
          }`}
        >
          1. List
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt("Enter URL");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={`h-10 px-3 transition-background duration-500 bg-[#ffcf9d] hover:scale-[1.04] hover:bg-[#FF962C] rounded-[10px] ${
            editor.isActive("link") ? "bg-gray-200" : ""
          }`}
        >
          Link
        </button>
      </div>

      <EditorContent
        className="editor-content border max-h-[200px] rounded-[12px] resizable"
        editor={editor}
      />
    </div>
  );
}
