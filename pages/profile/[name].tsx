import React from "react";

import Layout from "../../components/Layout";
import Router, { useRouter } from "next/router";
import { DayProps } from "../../components/Day";
import { Profiles } from "../../components/Profiles";

const Post: React.FC<DayProps> = (props) => {
  const router = useRouter();

  const { name } = router.query;

  return (
    <Layout>
      <Profiles filterBy={name as string} showBackLink />
    </Layout>
  );
};

export default Post;
