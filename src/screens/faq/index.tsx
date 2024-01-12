import React from "react";
import { Accordion, Container } from "react-bootstrap";
import TableHeader from "src/components/TableHeader";
import "./faq.scss";
const Faq = () => {
  const faqData = [
    {
      id: 0,
      title: "Lorem ipsum is a placeholder text",
      description:
        "Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may.",
    },
    {
      id: 1,
      title: "Lorem ipsum is a placeholder text",
      description:
        "Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may.",
    },
    {
      id: 2,
      title: "Lorem ipsum is a placeholder text",
      description:
        "Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may.",
    },
    {
      id: 3,
      title: "Lorem ipsum is a placeholder text",
      description:
        "Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may.",
    },
    {
      id: 4,
      title: "Lorem ipsum is a placeholder text",
      description:
        "Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may.",
    },
  ];
  return (
    <section className="faq">
      <Container>
        <TableHeader title="Frequently Asked Questions" />

        <div>
          <Accordion defaultActiveKey="0">
            {faqData?.map((item) => (
              <Accordion.Item eventKey={item.id.toString()} key={item.id}>
                <Accordion.Header>{item.title}</Accordion.Header>
                <Accordion.Body>{item.description}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </Container>
    </section>
  );
};

export default Faq;
