import Hero from "./Hero";
import Navbar from "./Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ComboboxDemo from "./ComboBox";

function ProductCard({ badgeText, title, description, content, buttonText }) {
  return (
    <Card className="border-2 w-96">
      <CardHeader>
        <Badge className="w-fit">{badgeText}</Badge>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
      <CardFooter>
        <Button>{buttonText}</Button>
      </CardFooter>
    </Card>
  );
}

function App() {
  const name = "Sinel Nemsara";
  const cartCount = 0;
  const accordionItems = [
    {
      title: "What products are available on the platform?",
      content:
        "Our platform offers a wide range of electronic products, including smartphones, laptops, accessories, and home appliances from top brands. New products are added regularly.",
    },
    {
      title: "How can I make a purchase?",
      content:
        "Simply browse through the product categories, add items to your cart, and proceed to checkout. You can choose from various payment options including credit cards, digital wallets, and cash on delivery.",
    },
    {
      title: "Do you offer product warranties?",
      content:
        "Yes, we offer warranties on most of the products we sell. Warranty terms and conditions may vary depending on the manufacturer and the product. Please check the product description for specific warranty information.",
    },
    {
      title: "How do I track my order?",
      content:
        "Once your order is shipped, you'll receive a tracking number via email or SMS. You can use this number on the carrier's website to track the delivery status of your order.",
    },
    {
      title: "Can I return or exchange a product?",
      content:
        "Yes, you can return or exchange products within 30 days of delivery. Please refer to our Returns & Exchanges policy for more details on how to initiate a return or exchange.",
    },
  ];

  const categoryOptions = [
    { value: "electronics", label: "Electronics" },
    { value: "fashion", label: "Fashion" },
    { value: "home-appliances", label: "Home Appliances" },
    { value: "sports", label: "Sports" },
    { value: "toys", label: "Toys" },
  ];

  return (
    <div>
      <Navbar name={name} cartCount={cartCount} />
      <Hero />
      <div className="p-4">
        <ComboboxDemo options={categoryOptions} placeholder="Select category" />
      </div>

      <div className="flex p-4 gap-x-4">
        <ProductCard
          badgeText="New"
          title="Premium Product 1"
          description="High-quality product"
          content="Product Content 1"
          buttonText="Buy Now"
        />
        <ProductCard
          badgeText="Sale"
          title="Premium Product 2"
          description="Best-selling item."
          content="Product Content 2"
          buttonText="Shop Now"
        />
        <ProductCard
          badgeText="Exclusive"
          title="Premium Product 3"
          description="Limited edition item."
          content="Product Content 3"
          buttonText="Add to Cart"
        />
      </div>

      <Accordion
        type="single"
        collapsible
        className="relative w-full p-8 border-2"
      >
        {accordionItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index + 1}`}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default App;
