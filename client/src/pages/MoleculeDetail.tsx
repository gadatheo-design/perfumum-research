import { useParams, Link } from "wouter";

export default function MoleculeDetail() {
  const params = useParams();
  const id = params.id || "0";

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Molécule #{id}</h1>
      <p>Version minimale - Test 1</p>
      <Link href="/molecules">
        <a className="text-primary underline">Retour à la liste</a>
      </Link>
    </div>
  );
}
