import {
  useState,
  useEffect,
  useRef,
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "@/styles/Watch.module.scss";
import { setContinueWatching } from "@/Utils/continueWatching";
import { toast } from "sonner";
import { IoReturnDownBack } from "react-icons/io5";
import { FaForwardStep, FaBackwardStep } from "react-icons/fa6";
import { BsHddStack, BsHddStackFill } from "react-icons/bs";
import axiosFetch from "@/Utils/fetchBackend";
import WatchDetails from "@/components/WatchDetails";
import Player from "@/components/Artplayer";
import Head from "next/head";
import { FaDiscord, FaDonate } from "react-icons/fa";
import useDeviceSize from "@/Utils/useDeviceSize";
import {
  providers,
  getEmbedUrl,
  DEFAULT_PROVIDER_ID,
} from "@/config/providers";

const Watch = () => {
  const params = useSearchParams();
  const { back, push } = useRouter();
  const [type, setType] = useState<string | null>(params.get("type"));
  const [id, setId] = useState<any>(params.get("id"));
  const [season, setSeason] = useState<any>(params.get("season"));
  const [episode, setEpisode] = useState<any>(params.get("episode"));
  const [minEpisodes, setMinEpisodes] = useState(1);
  const [maxEpisodes, setMaxEpisodes] = useState(2);
  const [maxSeason, setMaxSeason] = useState(1);
  const [nextSeasonMinEpisodes, setNextSeasonMinEpisodes] = useState(1);
  const [loading, setLoading] = useState(true);
  const [watchDetails, setWatchDetails] = useState(false);
  const [data, setdata] = useState<any>();
  const [seasondata, setseasonData] = useState<any>();
  const [source, setSource] = useState(DEFAULT_PROVIDER_ID);
  const [embedMode, setEmbedMode] = useState(true);
  const [nonEmbedSourcesIndex, setNonEmbedSourcesIndex] = useState<any>("");
  const [nonEmbedSources, setNonEmbedSources] = useState<any>("");
  const [nonEmbedCaptions, setnonEmbedCaptions] = useState<any>([]);
  const [nonEmbedVideoProviders, setNonEmbedVideoProviders] = useState([]);
  const [nonEmbedSourcesNotFound, setNonEmbedSourcesNotFound] =
    useState<any>(false);

  const nextBtn: any = useRef(null);
  const backBtn: any = useRef(null);
  const moreBtn: any = useRef(null);
  const { isMobile, isTablet, isDesktop, isTV } = useDeviceSize();
  const watchDetailRef: any = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        watchDetailRef.current &&
        !watchDetailRef?.current?.contains(event?.target)
      ) {
        setWatchDetails(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const embedStorage = localStorage.getItem("RiveStreamEmbedMode");
    setEmbedMode(embedStorage !== null ? JSON.parse(embedStorage) : false);

    const latestAgg = localStorage.getItem("RiveStreamLatestAgg");
    if (latestAgg) setSource(latestAgg);

    setLoading(true);
    setType(params.get("type"));
    setId(params.get("id"));
    setSeason(params.get("season"));
    setEpisode(params.get("episode"));
    setContinueWatching({ type: params.get("type"), id: params.get("id") });

    const fetch = async () => {
      const type = params.get("type");
      const id = params.get("id");
      const seasonStr = params.get("season");

      // Parse season safely to a number
      const seasonNum = seasonStr ? parseInt(seasonStr, 10) : 1;

      const res: any = await axiosFetch({
        requestID: `${type}Data`,
        id: id,
      });

      setdata(res);
      setMaxSeason(res?.number_of_seasons);

      const seasonData = await axiosFetch({
        requestID: `tvEpisodes`,
        id: id,
        season: seasonNum, // Now passing a number
      });

      setseasonData(seasonData);

      if (seasonData?.episodes?.length > 0) {
        setMaxEpisodes(
          seasonData.episodes[seasonData.episodes.length - 1].episode_number,
        );
        setMinEpisodes(seasonData.episodes[0].episode_number);
      }
    };

    if (params.get("type") === "tv") fetch();
    else
      axiosFetch({ requestID: `movieData`, id: params.get("id") }).then(
        setdata,
      );

    const handleKeyDown = (event: any) => {
      if (event.shiftKey && event.key === "N") {
        event.preventDefault();
        nextBtn?.current?.click();
      } else if (event.shiftKey && event.key === "P") {
        event.preventDefault();
        backBtn?.current?.click();
      } else if (event.shiftKey && event.key === "M") {
        event.preventDefault();
        moreBtn?.current?.click();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [params]);

  useEffect(() => {
    if (embedMode !== undefined)
      localStorage.setItem("RiveStreamEmbedMode", JSON.stringify(embedMode));
  }, [embedMode]);

  function handleBackward() {
    if (episode > minEpisodes)
      push(
        `/watch?type=tv&id=${id}&season=${season}&episode=${parseInt(episode) - 1}`,
      );
  }
  function handleForward() {
    if (episode < maxEpisodes)
      push(
        `/watch?type=tv&id=${id}&season=${season}&episode=${parseInt(episode) + 1}`,
      );
    else if (parseInt(season) + 1 <= maxSeason)
      push(
        `/watch?type=tv&id=${id}&season=${parseInt(season) + 1}&episode=${nextSeasonMinEpisodes}`,
      );
  }

  return (
    <>
      <Head>
        <title>
          Rive | Watch {id ? `| ${data?.name || data?.title || id}` : ""}
        </title>
      </Head>
      <div className={styles.watch}>
        <div onClick={() => back()} className={styles.backBtn}>
          <IoReturnDownBack />
        </div>

        <div className={styles.episodeControl}>
          {type === "tv" && (
            <>
              <div ref={backBtn} onClick={handleBackward}>
                <FaBackwardStep
                  className={episode <= minEpisodes ? styles.inactive : ""}
                />
              </div>
              <div ref={nextBtn} onClick={handleForward}>
                <FaForwardStep />
              </div>
            </>
          )}
          <div ref={moreBtn} onClick={() => setWatchDetails(!watchDetails)}>
            {watchDetails ? <BsHddStackFill /> : <BsHddStack />}
          </div>
        </div>

        {watchDetails && (
          <>
            <div className="modalOverlay"></div>
            <WatchDetails
              watchDetailRef={watchDetailRef}
              id={id}
              type={type}
              data={data}
              season={season}
              episode={episode}
              setWatchDetails={setWatchDetails}
            />
          </>
        )}

        <div className={styles.watchSelects}>
          {embedMode === true && (
            <select
              className={styles.source}
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                localStorage.setItem("RiveStreamLatestAgg", e.target.value);
              }}
            >
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}

          <select
            className={styles.embedMode}
            value={embedMode ? "true" : "false"}
            onChange={(e) => setEmbedMode(JSON.parse(e.target.value))}
          >
            <option value="true">Embed Mode</option>
            <option value="false">NON Embed Mode (AD-free)</option>
          </select>
        </div>

        {embedMode === true && id ? (
          <iframe
            scrolling="no"
            src={getEmbedUrl(
              source,
              type as "movie" | "tv",
              id,
              season,
              episode,
            )}
            className={styles.iframe}
            allowFullScreen
            allow="accelerometer; autoplay; encrypted-media; gyroscope;"
            referrerPolicy="origin"
          ></iframe>
        ) : (
          <div className={`${styles.loader} skeleton`}>
            {/* Non-Embed Logic rendered here */}
          </div>
        )}
      </div>
    </>
  );
};

export default Watch;
