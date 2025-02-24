import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

// Import createClient function from the specified module
import { createClient } from "@supabase/supabase-js";


// Define Supabase URL and API key
const supabase_url = "https://vnfifwsblpfforaszzkn.supabase.co";
const supabase_key = process.env.SUPABASE_API_KEY;

// Create a Supabase client using the Supabase URL and API key
const client = createClient(supabase_url, supabase_key);



const embeddings = new OpenAIEmbeddings({openAIApiKey:openAPIkey})
const vectorstore = new SupabaseVectorStore(embeddings, {
    client,
    tableName: "documents",
    queryName: "match_documents"
})


const retriever = vectorstore.asRetriever()

export {retriever}