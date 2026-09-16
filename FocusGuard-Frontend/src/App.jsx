import AppRoutes from "./routes/AppRoutes";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { RealtimeProvider } from "./context/RealtimeContext.jsx";

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <RealtimeProvider><AppRoutes /></RealtimeProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
