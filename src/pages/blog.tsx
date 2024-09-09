import { useEffect } from 'react';

const SubstackFeed = () => {
  useEffect(() => {
    window.SubstackFeedWidget = {
      substackUrl: "secretsbytessa.substack.com",
      layout: "right",
      posts: 3,
      colors: {
        primary: "#FF0000",
        secondary: "#00000",
        background: "#FFFFFF",
      },
    };

    const script = document.createElement('script');
    script.src = "https://substackapi.com/embeds/feed.js";
    script.async = true;
    document.body.appendChild(script);

    // Cleanup function to remove the script
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="substack-feed-embed"></div>;
};


const Blog=()=>{
    return(
        <div className="min-vh-100 container-fluid">
            <div className="text-center">
                <h1 className="s_text">Blog</h1>
                <p className="secondary_text">Stay Up to date with updates from Secrets By Tessa</p>
            </div>
            <div>
                <SubstackFeed/>
            </div>
            
        </div>
    )
}

export default Blog