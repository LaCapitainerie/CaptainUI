import Image from "next/image";
import { Product } from "@/components/captainui/stripe/checkout-session";
import { PaymentButton } from "@/components/captainui/stripe/pay-button";

export default function Stripe() {

  const product : Product = {
    name: "Product Name",
    price: 100,
    discount: 10,
    image: "",
    quantity: 1,
  }

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="flex w-full max-w-xs flex-col overflow-hidden rounded-lg  bg-white dark:bg-gray-950 shadow-md">
        <div className="relative m-2 flex h-60 overflow-hidden rounded-xl">
          <Image
            height={500}
            width={500}
            className="object-cover"
            src={product.image}
            alt="product image"
          />
          <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">
            {product.discount}% OFF
          </span>
        </div>
        <div className="mt-4 px-5 pb-5">
          <a href="#">
            <h5 className="text-xl tracking-tight text-slate-900 dark:text-gray-200">
              {product.name}
            </h5>
          </a>
          <div className="mt-2 mb-5 flex items-center justify-between">
            <p>
              <span className="text-3xl font-bold text-slate-900 dark:text-gray-200">
                ${(product.price - product.price * (product.discount / 100)).toFixed(2)}
              </span>
              <span className="text-sm text-slate-900 dark:text-gray-200 line-through">
                ${product.price.toFixed(2)}
              </span>
            </p>
          </div>
          <PaymentButton product={product} />
        </div>
      </div>
    </div>
  );
}