import type { Profile } from "@/types/profile";
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Music2,
  Link,
  Globe,
} from "lucide-react";

// Social icon helper function
export const getSocialIcon = (platform: string, url: string) => {
  const iconProps = { className: "w-4 h-4" };

  if (platform.includes("instagram") || url.includes("instagram")) {
    return <Instagram {...iconProps} className="text-primary" />;
  }
  if (platform.includes("facebook") || url.includes("facebook")) {
    return <Facebook {...iconProps} className="text-primary" />;
  }
  if (platform.includes("twitter") || url.includes("twitter")) {
    return <Twitter {...iconProps} className="text-primary" />;
  }
  if (platform.includes("youtube") || url.includes("youtube")) {
    return <Youtube {...iconProps} className="text-primary" />;
  }
  if (platform.includes("soundcloud") || url.includes("soundcloud")) {
    return <Music2 {...iconProps} className="text-primary" />;
  }
  if (platform.includes("mixcloud") || url.includes("mixcloud")) {
    return <Music2 {...iconProps} className="text-primary" />;
  }
  if (platform.includes("spotify") || url.includes("spotify")) {
    return <Music2 {...iconProps} className="text-primary" />;
  }
  if (platform.includes("website") || url.includes("http")) {
    return <Globe {...iconProps} className="text-primary" />;
  }
  return <Link {...iconProps} className="text-primary" />;
};

// Function to render social media icons
export const renderSocialIcons = (socialProfiles: Profile['socialProfiles']) => {
  if (!socialProfiles) {
    return (
      <span className="text-xs text-muted-foreground">
        No social profiles
      </span>
    );
  }

  let socialLinks: { platform: string; url: string }[] = [];

  if (typeof socialProfiles === "string") {
    socialLinks = [{ platform: "main", url: socialProfiles }];
  } else if (typeof socialProfiles === "object") {
    socialLinks = Object.entries(socialProfiles)
      .filter(([_, url]) => url && url.trim() !== "")
      .map(([platform, url]) => ({ platform, url: url as string }));
  }

  if (socialLinks.length === 0) {
    return (
      <span className="text-xs text-muted-foreground">
        No social profiles
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      {socialLinks.slice(0, 3).map(({ platform, url }, index) => (
        <a
          key={`${platform}-${index}`}
          href={url.startsWith("http") ? url : `https://${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-muted/80 transition-colors"
          onClick={(e) => e.stopPropagation()}
          title={`${platform}: ${url}`}
        >
          {getSocialIcon(platform, url)}
        </a>
      ))}
      {socialLinks.length > 3 && (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs text-muted-foreground">
          +{socialLinks.length - 3}
        </div>
      )}
    </div>
  );
};