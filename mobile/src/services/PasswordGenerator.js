
const geradorDeSenha = () => {
  let password = "";
  let caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let passwordLength = 12;
  for (let i = 0; i < passwordLength; i++) {
    password += caracteres.charAt(
      Math.floor(
        Math.random() * caracteres.length
      )
    );
  }
  return password;
};

export default geradorDeSenha;