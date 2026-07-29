import AppRoutes from "./routes/AppRoutes";
import { LanguageProvider } from "./context/LanguageContext.jsx";

function App() {
  return (
    <LanguageProvider>
      <AppRoutes />
    </LanguageProvider>
  );
}

export default App;
