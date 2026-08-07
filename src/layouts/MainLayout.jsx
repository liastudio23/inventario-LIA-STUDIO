import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "./MainLayout.css";

function MainLayout({ children }) {
  return (
    <div className="layout">
      <Header />

      <div className="content-area">
        <Sidebar />

        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;