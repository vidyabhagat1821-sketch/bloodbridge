import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Upload,
  FileText,
  Trash2,
  RefreshCw,
  Search,
  Database,
  Layers,
  Sparkles,
  Loader2,
  CheckCircle2,
  FileUp
} from 'lucide-react';
import { documentApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { SkeletonLoader } from '../components/common/SkeletonLoader';

export const KnowledgeManagementPage = () => {
  const toast = useToast();

  const [documents, setDocuments] = useState([]);
  const [totalChunks, setTotalChunks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Search Test Console state
  const [searchQuery, setSearchQuery] = useState('universal donor protocol');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Manual doc upload form
  const [manualTitle, setManualTitle] = useState('');
  const [manualContent, setManualContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await documentApi.getAll();
      if (res.success) {
        setDocuments(res.documents || []);
        setTotalChunks(res.totalVectorChunks || 0);
      }
    } catch (err) {
      toast.error('Failed to load documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile && !manualContent.trim()) {
      toast.warning('Please select a file (PDF/TXT/MD) or enter text content.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
        formData.append('title', manualTitle || selectedFile.name);
      } else {
        formData.append('title', manualTitle || 'Manual Clinical Guideline');
        formData.append('content', manualContent);
      }

      const res = await documentApi.upload(formData);
      if (res.success) {
        toast.success(res.message || 'Document uploaded and chunked successfully!');
        setSelectedFile(null);
        setManualTitle('');
        setManualContent('');
        fetchDocuments();
      }
    } catch (err) {
      toast.error(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleReprocess = async (id) => {
    try {
      const res = await documentApi.reprocess(id);
      if (res.success) {
        toast.success('Document re-chunked and re-embedded!');
        fetchDocuments();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document and all its vector chunks?')) return;
    try {
      const res = await documentApi.delete(id);
      if (res.success) {
        toast.info(res.message);
        fetchDocuments();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSearchTest = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const res = await documentApi.searchTest(searchQuery, 4);
      if (res.success) {
        setSearchResults(res.results || []);
        toast.success(`Retrieved ${res.count} relevant vector chunks`);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-white flex items-center gap-2.5">
          <Database className="w-8 h-8 text-amber-400" />
          RAG Knowledge Base & Vector Index Inspector
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Upload medical protocols, inspect text chunking, and test vector similarity search
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Ingested Documents</span>
          <div className="text-2xl font-bold text-white font-mono">{documents.length}</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Total Vector Chunks</span>
          <div className="text-2xl font-bold text-rose-400 font-mono">{totalChunks}</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-xs font-semibold text-slate-400">Vector Search Algorithm</span>
          <div className="text-lg font-bold text-emerald-400">Cosine Similarity</div>
        </div>
      </div>

      {/* Grid: Document Ingestion Dropzone + Vector Search Test Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Upload Form (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Upload className="w-5 h-5 text-rose-400" />
              Ingest New Clinical Document
            </h3>
            <p className="text-xs text-slate-400">
              Upload PDF, TXT, or Markdown documents to automatically clean, chunk, and index into the vector store.
            </p>

            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Document Title (Optional)
                </label>
                <input
                  type="text"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="e.g. Pediatric Transfusion Guidelines"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* File Drop Area */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Select File (PDF, TXT, MD)
                </label>
                <input
                  type="file"
                  accept=".pdf,.txt,.md"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-rose-400 hover:file:bg-slate-800 cursor-pointer"
                />
              </div>

              <div className="text-center text-xs text-slate-500 font-semibold">— OR PASTE RAW TEXT —</div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Raw Text / Markdown Content
                </label>
                <textarea
                  rows="4"
                  value={manualContent}
                  onChange={(e) => setManualContent(e.target.value)}
                  placeholder="Paste clinical guideline text here..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-rose-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-crimson-600 to-rose-600 hover:from-crimson-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-crimson-950/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Extracting & Chunking...
                  </>
                ) : (
                  <>
                    <FileUp className="w-4 h-4" />
                    Ingest & Index Document
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Vector Similarity Search Tester (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Search className="w-5 h-5 text-amber-400" />
                Vector Similarity Search Test Console
              </h3>
              <span className="text-xs text-slate-400">Live Cosine Match</span>
            </div>
            <p className="text-xs text-slate-400">
              Test semantic search across all indexed chunks to evaluate retrieval quality before prompting the LLM.
            </p>

            <form onSubmit={handleSearchTest} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter search phrase (e.g. 'O- universal red cell', 'antibiotics deferral')..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={searching}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Test Search
              </button>
            </form>

            {/* Results Preview */}
            <div className="space-y-3 pt-2">
              {searchResults.length > 0 ? (
                searchResults.map((res, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between font-bold text-white">
                      <span className="text-rose-400 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        {res.documentTitle} (Chunk #{res.chunkIndex})
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 font-mono text-[11px] border border-amber-800">
                        Score: {res.score}
                      </span>
                    </div>
                    <p className="text-slate-300 italic text-[11px] leading-relaxed">
                      "{res.text}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-500">
                  Enter a clinical query and click "Test Search" to view top matching chunks.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Indexed Documents Table */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-rose-400" />
          Ingested Documents Directory
        </h3>

        {loading ? (
          <SkeletonLoader count={2} />
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-rose-400" />
                    <h4 className="font-bold text-white text-sm">{doc.title}</h4>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 font-mono">
                      {doc.chunksCount || 3} Chunks
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{doc.contentPreview}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleReprocess(doc.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    title="Re-chunk and Re-embed"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Reprocess
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Delete Document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
