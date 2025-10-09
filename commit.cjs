const { execSync } = require("child_process");
const readline = require("readline");

// Crear interfaz para leer input del usuario
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Preguntar al usuario por el mensaje del commit
rl.question("📝 Escribe el mensaje del commit: ", (mensaje) => {
  if (!mensaje.trim()) {
    console.log("❌ El mensaje del commit no puede estar vacío.");
    rl.close();
    return;
  }

  try {
    console.log("📦 Añadiendo archivos...");
    execSync("git add .", { stdio: "inherit" });

    console.log(`🔐 Haciendo commit con mensaje: "${mensaje}"`);
    execSync(`git commit -m "${mensaje}"`, { stdio: "inherit" });

    console.log("🚀 Haciendo push forzado...");
execSync("git push origin main --force", { stdio: "inherit" });
    console.log("🌐 Haciendo deploy...");
    execSync("npm run deploy", { stdio: "inherit" });

    console.log("✅ Todo listo!");
  } catch (err) {
    console.error("❌ Error durante el proceso:", err.message);
  }

  rl.close();
});
