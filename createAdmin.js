// Script pour créer un admin de secours
async function createAdmin() {
  try {
    const response = await fetch('https://bookstore-d1k4.onrender.com/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: "Super Admin",
        email: "saidoun.islam@gmail.com",
        password: "lakamora45"
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ SUCCÈS ! Utilisateur créé :", data);
    } else {
      console.log("❌ ERREUR :", data);
    }
  } catch (error) {
    console.log("❌ ERREUR DE CONNEXION :", error);
  }
}

createAdmin();