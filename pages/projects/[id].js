import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const styles = {
  container: 'min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8',
  title: 'text-4xl font-bold text-center mb-8 text-orange-500',
  content: 'flex bg-gray-800 rounded-lg shadow-lg overflow-hidden',
  sidebar: 'bg-gray-900 transition-all duration-300 ease-in-out',
  sidebarCollapsed: 'w-16',
  sidebarExpanded: 'w-64',
  tabs: 'flex flex-col',
  tabButton: 'flex items-center p-4 hover:bg-gray-800 transition-colors duration-200',
  tabIcon: 'mr-3',
  activeTab: 'bg-gray-800 text-orange-500',
  tabContent: 'p-4',
  mainContent: 'flex-1 relative',
  toggleButton: 'absolute top-1/2 -translate-y-1/2 left-0 bg-orange-500 text-white p-2 rounded-r-md',
  dropzone: 'border-2 border-dashed border-orange-500 rounded-lg p-8 text-center cursor-pointer',
  pdfViewer: 'h-full flex flex-col items-center overflow-y-auto bg-gray-800 p-4',
  pdfControls: 'flex justify-between items-center w-full p-4 bg-gray-900 mt-4',
  button: 'px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors duration-200',
  errorMessage: 'text-red-500 mt-4 text-center',
};

export default function ProjectPage() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [width] = useWindowSize();
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    if (id) {
      fetch(`/api/projects/${id}`)
        .then((response) => response.json())
        .then((data) => setProject(data));
    }
  }, [id]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const uploadedFile = acceptedFiles[0];
      if (uploadedFile.type === 'application/pdf') {
        setFile(URL.createObjectURL(uploadedFile));
        setError(null);
      } else {
        setError('Please upload a PDF file.');
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'application/pdf',
    multiple: false,
  });

  if (!project) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{project.name}</h1>
      <div className={styles.content}>
        <div className={styles.mainContent}>
          <div className={styles.tabs}>
            <div {...getRootProps()} className={styles.dropzone}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the PDF file here ...</p>
              ) : (
                <p>Drag 'n' drop a PDF file here, or click to select a file</p>
              )}
            </div>
            {file && (
              <div className={styles.pdfViewer}>
                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
                  <Viewer fileUrl={file} plugins={[defaultLayoutPluginInstance]} />
                </Worker>
              </div>
            )}
            {error && <p className={styles.errorMessage}>{error}</p>}
          </div>
          <div>
            {/* Flashcards UI */}
          </div>
        </div>
      </div>
    </div>
  );
}
