import TextAnimation from "@/components/animations/TextAnimation";

const OurStoryAndResults = () => {
  return (
    <section className="py-20 lg:py-[120px] bg-primary/2">
      <div className="container">
        <div className="mb-16 text-center">
          <h2 className="text-3xl lg:text-5xl mx-auto max-w-[880px]">
            <TextAnimation text="Our Storie" />{" "}
            <span className="text-primary">
              <TextAnimation delay={0.4} text="and Results" />
            </span>
          </h2>
        </div>
        <div className="flex flex-col gap-16 stories-description mx-auto max-w-[1060px]">
          {data.map((item, index) => (
            <div key={index}>
              <h3 className="text-2xl font-semibold mb-3 border-l-2 border-primary pl-4">
                {item.title}
              </h3>
              <div className="text-secondary pl-4">{item.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const data = [
  {
    title: "Summary",
    description: (
      <div>
        <p>
          We’ve driven growth for artists across{" "}
          <b>more than 10 music genres,</b> including:
        </p>
        <ul className="grid grid-cols-2 list-disc gap-2 mb-10 pl-4 max-w-[500px]">
          <li>Dark ambient</li>
          <li>Sleeping</li>
          <li>Hard techno</li>
          <li>HyperTechno</li>
          <li>HardStyle</li>
          <li>Afro-house</li>
          <li>DeephHouse</li>
          <li>Uk Garage</li>
          <li>Bass Boosted</li>
          <li>Drill</li>
          <li>Phonk (brazilian funk)</li>
          <li>K-pop</li>
          <li>Religious</li>
          <li>And many others.</li>
        </ul>
        <p>
          Our strategy is built around <u>high-volume creative testing</u> and
          consistent <u>budget management</u> to optimize cost per result (CPR).
        </p>
        <p>
          Across different clients budgets we started from a monthly ad spend of
          $27,000, and we successfully scaled campaigns to $45,000 while{" "}
          <u>reducing costs by over 40%.</u>
        </p>
      </div>
    ),
  },
  {
    title: "Challenges",
    description: (
      <ul className="grid grid-cols-1 list-disc gap-2 mb-10 pl-4">
        <li>
          <b>Reducing Costs:</b> we had to reduce an average cost per result
          (CPR) of $0.22 from the previous agency, which was not profitable.
        </li>
        <li>
          <b>Creating &amp; Editing the Ads:</b> Designing and executing a
          high-volume creative testing system on a weekly basis.
        </li>
        <li>
          <b>Scaling Budgets:</b> Scaling advertising budgets while
          simultaneously lowering acquisition costs.
        </li>
        <li>
          <b>Segmentation:</b> Identifying the countries that generate the
          highest revenue and segmenting them to achieve not only low CPR, but
          also a high volume of Spotify streams.
        </li>
      </ul>
    ),
  },
  {
    title: "Solution",
    description: (
      <div>
        <p>
          At Escalium we developed a very specific marketing strategy to
          increase new fans on spotify while reducing costs.
        </p>
        <ul className="grid grid-cols-1 list-disc gap-2 mb-10 pl-4">
          <li>
            <b>Identify the core problems:</b>&nbsp;We had to identify the
            challenges that was costing the artists high costs and not achieving
            profitability, in this case was the{" "}
            <u>low volume of creatives and the poor management.</u>
          </li>
          <li>
            <b>Creative testing:</b> One of the problems the artists had, is
            that they didn’t have a creative system and they were running only
            2-3 ads per week, which lead to high costs. When they started
            working with us, we created a full system that lead to creating a
            high volume of creatives every single month{" "}
            <u>(+300 ads/month) consistently</u>
          </li>
          <li>
            <b>Management:</b>&nbsp;We have someone watching and monitoring from
            monday to sunday at least 4 hours a day: campaigns costs, optimising
            budgets, turning off bad creatives and on new ones.
          </li>
        </ul>
      </div>
    ),
  },
  {
    title: "Results",
    description: (
      <div>
        <p>
          Escalium efforts helped Different Artists grow
          significantly&nbsp;&nbsp;its audience and streams:
        </p>
        <ul className="grid grid-cols-1 list-disc gap-2 mb-10 pl-4">
          <li>
            <b>Costs:</b>&nbsp;We decreased costs by over 50%&nbsp;
          </li>
          <li>
            <b>Results:</b>&nbsp;While increasing meta ads results by over 300%
          </li>
          <li>
            <b>Spotify Streams:</b>&nbsp;We have made +100M Streams across
            different artists.
          </li>
          <li>
            <b>Spotify Monthly Listeners: </b>We added +5M Monthly Listeners to
            different artists.
          </li>
          <li>
            <b>TikTok: </b>We have generated over 20 million views across
            multiple TikTok accounts and videos, while making songs go viral and
            inspiring more than 2,000 videos using the same audio.
          </li>
        </ul>
        <h4 className="text-lg font-semibold mb-3">
          <strong>Key Metrics</strong>
        </h4>
        <ul className="grid grid-cols-1 list-disc gap-2 pl-4">
          <li>
            <span>100M+ Streams Generated</span>
          </li>
          <li>
            <span>5M+ MonthlyListeners Added</span>
          </li>
          <li>
            <span>2,000+ Videos using the same audio</span>
          </li>
        </ul>
      </div>
    ),
  },
];

export default OurStoryAndResults;
