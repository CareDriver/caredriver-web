/* 
var admin = require("firebase-admin");


var serviceAccount = require("path/to/serviceAccountKey.json");


admin.initializeApp({

  credential: admin.credential.cert(serviceAccount)

});
*/

// -----------------------------------------------------

/* const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

admin.auth().createUser({
  email: 'usuario@example.com',
  emailVerified: false,
  password: 'contraseña_secreta',
})
.then((userRecord) => {
  console.log('Usuario creado exitosamente:', userRecord.uid);
})
.catch((error) => {
  console.log('Error al crear el usuario:', error);
});
 */
