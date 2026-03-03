import type { ReactNode } from "react";
export const metadata={title:"MANUS",description:"Agentic execution framework"};
export default function RootLayout({children}:{children:ReactNode}){return(<html lang="en"><body style={{fontFamily:"ui-sans-serif,system-ui",margin:0}}><div style={{padding:24,maxWidth:1100,margin:"0 auto"}}>{children}</div></body></html>);} 
