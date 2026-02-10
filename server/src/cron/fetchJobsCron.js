import cron from "node-cron";
import { fetchJobsFromAPI } from "../services/jobService.js";
import { jobQueue } from "../queues/jobQueue.js";

const urls = [
  "https://jobicy.com/?feed=job_feed",
  "https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time",
  "https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france",
  "https://jobicy.com/?feed=job_feed&job_categories=design-multimedia",
  "https://jobicy.com/?feed=job_feed&job_categories=data-science",
  "https://jobicy.com/?feed=job_feed&job_categories=copywriting",
  "https://jobicy.com/?feed=job_feed&job_categories=business",
  "https://jobicy.com/?feed=job_feed&job_categories=management",
  "https://www.higheredjobs.com/rss/articleFeed.cfm",
];

cron.schedule("*/2 * * * *", async () => { // runs every 2 minutes for testing
  console.log("⏰ Cron triggered");

  for (const url of urls) {
    try {
      console.log("🌐 Fetching:", url);
      const data = await fetchJobsFromAPI(url);
      const items = data?.rss?.channel?.item;

      if (!items) {
        console.warn("⚠️ No items found for:", url);
        continue;
      }

      const jobItems = Array.isArray(items) ? items : [items];

      const jobs = jobItems.map((item) => ({
        id: item.guid?._ || item.guid,
        title: item.title,
        company: item["job:company"] || "",
        location: item["job:location"] || "",
        url: item.link,
        category: item.category,
        type: item["job:type"],
        description: item.description,
        source: url,
      }));

      console.log(`📦 Queuing ${jobs.length} jobs`);
      await jobQueue.add("import-jobs", { jobs, sourceUrl: url });
    } catch (err) {
      console.error("❌ Cron error:", err.message);
    }
  }
});

