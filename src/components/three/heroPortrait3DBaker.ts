import animeAprendiz from '../../assets/images/anime_aprendiz_1795391490975.jpg';
import animeDoncella from '../../assets/images/anime_doncella_1795391489665.jpg';
import animeDuende from '../../assets/images/anime_duende_1795391490980.jpg';
import animeLenador from '../../assets/images/anime_lenador_1795391587527.jpg';
import animePastor from '../../assets/images/anime_pastor_1795391492048.jpg';
import animeRobot from '../../assets/images/anime_robot_1795391588310.jpg';
import animeChaman from '../../assets/images/anime_chaman_1795391588791.jpg';
import animeGrumete from '../../assets/images/anime_grumete_1795391587768.jpg';
import animeLadron from '../../assets/images/anime_ladron_1795391588011.jpg';
import animeViajero from '../../assets/images/anime_viajero_hd_1795432679859.jpg';
import animeVikingo from '../../assets/images/anime_vikingo_1795391488350.jpg';
import animeCaballero from '../../assets/images/anime_caballero_1795391490378.jpg';
import animeElfa from '../../assets/images/anime_elfa_1795391490081.jpg';
import animeMonje from '../../assets/images/anime_monje_1795391493901.jpg';
import animeCentinela from '../../assets/images/anime_centinela_1795391489963.jpg';
import animeKarateka from '../../assets/images/anime_karateka_1795391588016.jpg';
import animeMosquetero from '../../assets/images/anime_mosquetero_1795391588370.jpg';
import animeBufon from '../../assets/images/anime_bufon_1795391490505.jpg';
import animeFrancotirador from '../../assets/images/anime_francotirador_1795391490318.jpg';
import animeCavernicola from '../../assets/images/anime_cavernicola_1795391490205.jpg';
import animeBruja from '../../assets/images/anime_bruja_1795391588380.jpg';
import animeNinja from '../../assets/images/anime_ninja_1795391490019.jpg';
import animeFaraon from '../../assets/images/anime_faraon_1795391588014.jpg';
import animeCentauro from '../../assets/images/anime_centauro_1795391587408.jpg';
import animeValkiria from '../../assets/images/anime_valkiria_hd_1795432679805.jpg';
import animeSamurai from '../../assets/images/anime_samurai_hd_1795432680096.jpg';
import animeMago from '../../assets/images/anime_mago_hd_1795432679221.jpg';
import animeDruida from '../../assets/images/anime_druida_1795391491281.jpg';
import animeSacerdotisa from '../../assets/images/anime_sacerdotisa_1795391489309.jpg';
import animeVampira from '../../assets/images/anime_vampira_1795428105487.jpg';
import animeSirena from '../../assets/images/anime_sirena_1795428106438.jpg';
import animeEsqueleto from '../../assets/images/anime_esqueleto_1795428104454.jpg';
import animeEjecutor from '../../assets/images/anime_ejecutor_hd_1795437661996.jpg';

export const HERO_ANIME_PORTRAITS: Record<string, string> = {
  aprendiz: animeAprendiz,
  doncella: animeDoncella,
  duende: animeDuende,
  lenador: animeLenador,
  pastor: animePastor,
  robot: animeRobot,
  chaman: animeChaman,
  grumete: animeGrumete,
  ladron: animeLadron,
  esqueleto: animeEsqueleto,
  viajero: animeViajero,
  vikingo: animeVikingo,
  caballero: animeCaballero,
  elfa: animeElfa,
  monje: animeMonje,
  centinela: animeCentinela,
  karateka: animeKarateka,
  mosquetero: animeMosquetero,
  bufon: animeBufon,
  francotirador: animeFrancotirador,
  cavernicola: animeCavernicola,
  bruja: animeBruja,
  ninja: animeNinja,
  vampira: animeVampira,
  faraon: animeFaraon,
  centauro: animeCentauro,
  valkiria: animeValkiria,
  samurai: animeSamurai,
  mago: animeMago,
  druida: animeDruida,
  sacerdotisa: animeSacerdotisa,
  sirena: animeSirena,
  ejecutor: animeEjecutor,
};

export function getHero3DPortraitSync(heroId: string): string | null {
  return HERO_ANIME_PORTRAITS[heroId] || null;
}

export function subscribeHero3DPortrait(
  heroId: string,
  onReady: (url: string) => void
): () => void {
  const existing = getHero3DPortraitSync(heroId);
  if (existing) {
    onReady(existing);
  }
  return () => {};
}
