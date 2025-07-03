package dev.bluesion.mnservice.task1.data.model

/**
 * GPS 측정값을 나타내는 데이터 클래스입니다.
 *
 * @property latitude 위도
 * @property longitude 경도
 * @property angle 진행 방향 각도(도 단위)
 * @property speed 속도(km/h)
 * @property hdop 수평 정확도(HDOP)
 */
data class GpsPoint(
    val latitude: Double,
    val longitude: Double,
    val angle: Double,
    val speed: Double,
    val hdop: Double
)