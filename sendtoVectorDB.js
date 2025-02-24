// Import the PDFLoader class from the specified module
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

// Import the RecursiveCharacterTextSplitter class from the specified module
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// Import SupabaseVectorStore class and OpenAIEmbeddings class from the specified modules
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

import {retriever} from "./receiver"

// Import createClient function from the specified module
import { createClient } from "@supabase/supabase-js";

// Create a new instance of the PDFLoader class with the specified PDF file path
const loader = new PDFLoader("papers/Using_AWS_in_the_Context_of_UK_Healthcare_IG_SoC_Process.pdf", {
    parsedItemSeparator: ""
});

// Define Supabase URL and API key
const supabase_url = "https://vnfifwsblpfforaszzkn.supabase.co";
const supabase_key = process.env.SUPABASE_API_KEY;

// Create a Supabase client using the Supabase URL and API key
const client = createClient(supabase_url, supabase_key);

// Define OpenAI API key
const openAPIkey = process.env.OPEN_API_KEY;

// Load the PDF document using the loader and store the result in the 'docs' variable
const docs = await loader.load();

// Define the chunk size for text splitting
const chunksize = 2000;

// Extract the page content from each page in the loaded document and store it in 'doc_content'
var doc_content = docs.map((page) => (page.pageContent));

// Create a new instance of the RecursiveCharacterTextSplitter class
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: chunksize,
    chunkOverlap: (chunksize) => chunksize * 0.1, // returns 10% of chunksize,
    separators: ["\n\n", "\n", " ", ""]
});

// Use the splitter to split the document content into individual documents
const split_docs = await splitter.createDocuments(doc_content);
const split_docs_str = split_docs.map((page) => (page.pageContent));
const split_docs_idx = split_docs.map((page, index) => ({ id: index }));

// Use SupabaseVectorStore to insert documents into the Supabase database
await SupabaseVectorStore.fromTexts(
    split_docs_str,
    split_docs_idx,
    new OpenAIEmbeddings({ openAIApiKey: openAPIkey }),

    {
        client,
        tableName: 'documents',
        queryName: "match_documents",
    }
);


//#########################


// 