declare global {
    interface Window {
      SubstackFeedWidget: {
        substackUrl: string;
        posts: number;
        filter?:string;
        layout: string,
        colors: {
          primary: string;
          secondary: string;
          background: string;
        };
      };
    }
  }
  
  export {};
  