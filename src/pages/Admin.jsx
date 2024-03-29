import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { MdAddLink } from "react-icons/md";
import { toast } from "react-toastify";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Logo } from "../components/Logo";
import { db } from "../services/firebaseConnection";

export function Admin() {
  const [nameInput, setNameInput] = useState("");
  const [urlInput, setUrlInput] = useState("");

  const [backgroundColorInput, setBackgroundColorInput] = useState("#f1f1f1");
  const [textColorInput, setTextColorInput] = useState("#121212");

  const [links, setLinks] = useState([]);

  useEffect(() => {
    const linksRef = collection(db, "links");
    const queryRef = query(linksRef, orderBy("createdAt", "asc"));

    onSnapshot(queryRef, (snapshot) => {
      let list = [];
      snapshot.forEach((doc) => {
        list.push({
          id: doc.id,
          name: doc.data().name,
          url: doc.data().url,
          bg: doc.data().bg,
          color: doc.data().color,
        });
      });

      setLinks(list);
    });
  }, []);

  async function handleRegister(e) {
    e.preventDefault();
    if (nameInput === "" || urlInput === "") {
      toast.warn("Preencha todos os campos");
      return;
    }
    addDoc(collection(db, "links"), {
      name: nameInput,
      url: urlInput,
      bg: backgroundColorInput,
      color: textColorInput,
      createdAt: new Date(),
    })
      .then(() => {
        setNameInput("");
        setUrlInput("");
        toast.success("Link registrado com sucesso ");
      })
      .catch((error) => {
        console.log("Error ao registrar" + error);
        toast.error("Erro ao registrar o link");
      });
  }

  async function handleDeleteLink(id) {
    const docRef = doc(db, "links", id);
    await deleteDoc(docRef);
  }

  return (
    <div className="flex flex-col items-center min-h-screen pb-6">
      <Header />
      <Logo />

      <form
        action=""
        className="flex flex-col w-full max-w-[600px]"
        onSubmit={handleRegister}
      >
        <label htmlFor="" className="text-white font-medium mt-2 mb-3">
          Nome do link
        </label>
        <Input
          type="text"
          placeholder="Nome do link"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />

        <label htmlFor="" className="text-white font-medium mt-2 mb-3">
          URL do link
        </label>
        <Input
          type="url"
          placeholder="Digite a URL"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
        />

        <section className="flex text-white m-4 gap-4">
          <div>
            <label htmlFor="" className="mr-3">
              Fundo do Link
            </label>
            <input
              type="color"
              value={backgroundColorInput}
              onChange={(e) => setBackgroundColorInput(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="" className="mr-3">
              Cor do Link
            </label>
            <input
              type="color"
              value={textColorInput}
              onChange={(e) => setTextColorInput(e.target.value)}
            />
          </div>
        </section>

        {nameInput !== "" && (
          <div className="border-2 border-white/50 rounded flex flex-col items-center justify-center mb-7 p-1">
            <label htmlFor="" className="text-white font-medium mt-2 mb-3">
              Veja como está ficando - Preview 👇
            </label>
            <article
              className="w-[90%] max-w-2xl flex items-center justify-between bg-black/40 rounded py-4 px-3 text-white animate-Pop"
              style={{
                marginTop: 8,
                marginBottom: 8,
                background: backgroundColorInput,
              }}
            >
              <p style={{ color: textColorInput }}>{nameInput}</p>
            </article>
          </div>
        )}

        <button
          type="submit"
          className="flex items-center justify-center p-2 bg-blue-300 hover:bg-blue-400 transition-colors mb-7 gap-2 text-white rounded"
        >
          Cadastrar <MdAddLink size={24} />
        </button>
      </form>

      <h2 className="text-white mt-7 mr-0 mb-4 ml-0">Meus links</h2>

      {links.map((item, index) => {
        return (
          <article
            key={index}
            className="w-[90%] max-w-2xl flex items-center justify-between mb-2 bg-black/40 rounded py-4 px-3 text-white animate-Pop"
            style={{
              backgroundColor: item.bg,
              color: item.color,
            }}
          >
            <p>{item.name}</p>
            <button
              className="border-dashed border-[1px] border-white bg-black hover:bg-red-700 py-1 px-2 rounded text-white"
              onClick={() => handleDeleteLink(item.id)}
            >
              <FiTrash2 size={18} />
            </button>
          </article>
        );
      })}
    </div>
  );
}
