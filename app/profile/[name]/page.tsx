import React from "react";
import Layout from "../../../components/Layout";
import { Profiles } from "../../../components/Profiles";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  return (
    <Layout>
      <Profiles filterBy={name} showBackLink />
    </Layout>
  );
}
