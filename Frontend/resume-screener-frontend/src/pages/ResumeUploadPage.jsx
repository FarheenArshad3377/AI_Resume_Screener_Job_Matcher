import Header from "../components/Header";
import UploadForm from "../components/UploadForm";

export default function ResumeUploadPage() {
  return (
    <div style={{ backgroundColor: '#eef1f8', minHeight: '100vh' }}>
      <Header variant="simple" />
      <div className="d-flex justify-content-center align-items-center py-5 px-3">
        <UploadForm />
      </div>
    </div>
  );
}