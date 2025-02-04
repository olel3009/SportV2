import Image from "next/image";
import styles from "../page.module.css";
import { json } from "stream/consumers";
import exp from "constants";
import Layout from "../../../generic_functions/base_layout";


export default function Home() {
  return (
    <Layout>
      <h1>Testseite</h1>
      <p>Nur hier um zu existieren</p>
      <p>Dies ist mehr Content</p>
      <p>Dies ist mehr Content</p>
      <p>Dies ist mehr Content</p>
      <p>Dies ist mehr Content</p>
      <p>Dies ist mehr Content</p>
      <p>Dies ist mehr Content</p>
      <p>Dies ist mehr Content</p>
      <p>Dies ist mehr Content</p>
      <p>Dies ist mehr Content</p>
      <p>Dies ist mehr Content</p>
    </Layout>
  );
}